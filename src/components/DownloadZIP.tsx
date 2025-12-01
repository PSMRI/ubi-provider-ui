import {
  Button,
  useToast,
  Spinner,
  Flex,
  Text,
  Progress,
} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  fetchAllApplicationsWithDocuments,
  downloadDocumentFromUrl,
} from "../services/benefits";
import { decodeBase64ToJson } from "../services/helperService";

interface DownloadZIPProps {
  benefitId: string;
  benefitName: string;
  selectedStatus?: string;
}

const DownloadZIP: React.FC<DownloadZIPProps> = ({
  benefitId,
  benefitName,
  selectedStatus = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const toast = useToast();

  // Helper function to sanitize file names
  const sanitizeFileName = (name: string | number) =>
    String(name)
      .replaceAll(/[\\/:*?"<>|]/g, "_")
      .replaceAll(/\s+/g, "_");

  // Helper function to convert application data to CSV
  const convertApplicationToCSV = (applicationData: any): string => {
    if (!applicationData || typeof applicationData !== "object") {
      return "";
    }

    // Extract all fields from applicationData
    const headers: string[] = [];
    const values: string[] = [];

    Object.keys(applicationData).forEach((key) => {
      // Skip complex objects and arrays for CSV simplicity
      const value = applicationData[key];
      if (value !== null && value !== undefined && typeof value !== "object") {
        headers.push(key);
        // Escape double quotes and wrap in quotes if contains comma or newline
        const stringValue = String(value);
        const escapedValue =
          stringValue.includes(",") || stringValue.includes("\n")
            ? `"${stringValue.replaceAll(/"/g, '""')}"`
            : stringValue;
        values.push(escapedValue);
      }
    });

    // Create CSV content
    const csvContent = [headers.join(","), values.join(",")].join("\n");
    return csvContent;
  };

  // Helper function to get file extension from content type or filename
  const getFileExtension = (
    contentType?: string,
    filename?: string
  ): string => {
    if (filename) {
      const ext = filename.split(".").pop();
      if (ext && ext.length < 5) return ext;
    }

    if (contentType) {
      const mimeToExt: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "image/png": "png",
        "image/gif": "gif",
        "image/webp": "webp",
        "application/pdf": "pdf",
        "application/msword": "doc",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          "docx",
        "text/plain": "txt",
      };
      return mimeToExt[contentType] || "bin";
    }

    return "bin";
  };

  // Helper function to extract filename from URL or path
  const extractFilename = (path: string): string => {
    return path.split("/").pop() || "document";
  };

  // Helper function to decode base64 if needed
  const base64ToBlob = (base64: string, contentType: string = ""): Blob => {
    // Remove data URL prefix if present
    const base64Data = base64.includes(",") ? base64.split(",")[1] : base64;

    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.codePointAt(i) ?? 0;
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: contentType });
    } catch (error) {
      console.error("Failed to decode base64:", error);
      throw new Error("Invalid base64 string");
    }
  };

  // Helper function to add CSV to application folder
  const addApplicationCSV = (
    folder: JSZip,
    applicationData: any,
    identifier: string
  ) => {
    try {
      const csvContent = convertApplicationToCSV(applicationData);
      if (csvContent) {
        const BOM = "\uFEFF";
        folder.file("application_data.csv", BOM + csvContent);
      }
    } catch (error) {
      console.error(
        `Failed to create CSV for application ${identifier}:`,
        error
      );
    }
  };

  // Helper function to download images from VC
  const downloadVCImages = async (
    credentialSubject: any,
    folder: JSZip,
    vcFileName: string,
    docIndex: number
  ) => {
    if (!credentialSubject || typeof credentialSubject !== "object") return;

    let imageCounter = 0;
    for (const [, entry] of Object.entries(credentialSubject)) {
      const hasUrl = entry && typeof entry === "object" && "url" in entry;
      const urlValue = hasUrl ? (entry as { url: unknown }).url : null;

      if (hasUrl && typeof urlValue === "string") {
        try {
          const imageBlob = await downloadDocumentFromUrl(urlValue);
          const imageExt = urlValue.split(".").pop()?.split("?")[0] || "jpg";
          const imageName = `${docIndex + 1}_${vcFileName}_image_${
            imageCounter + 1
          }.${imageExt}`;
          folder.file(imageName, imageBlob);
          imageCounter++;
        } catch (error) {
          console.error(`Failed to download image from ${urlValue}:`, error);
        }
      }
    }
  };

  // Helper function to save fallback document
  const saveFallbackDocument = (file: any, folder: JSZip, docIndex: number) => {
    const contentType =
      file.fileType || file.documentType || "application/octet-stream";
    const documentBlob = base64ToBlob(file.fileContent, contentType);
    const documentName =
      file.documentName ||
      file.documentSubtype ||
      extractFilename(file.filePath || `document_${docIndex + 1}`);

    let finalDocName = documentName;
    if (!finalDocName.includes(".")) {
      const ext = getFileExtension(contentType, file.filePath);
      finalDocName = `${finalDocName}.${ext}`;
    }

    const sanitizedName = sanitizeFileName(finalDocName);
    folder.file(`${docIndex + 1}_${sanitizedName}`, documentBlob);
  };

  // Helper function to process VC document
  const processVCDocument = async (
    file: any,
    folder: JSZip,
    docIndex: number,
    identifier: string
  ) => {
    try {
      const decodedVC = decodeBase64ToJson(file.fileContent);
      const vcFileName = sanitizeFileName(
        file.documentSubtype || `document_${docIndex + 1}`
      );

      // Save VC JSON
      folder.file(
        `${docIndex + 1}_${vcFileName}_vc.json`,
        JSON.stringify(decodedVC, null, 2)
      );

      // Download images from VC
      await downloadVCImages(
        decodedVC?.credentialSubject,
        folder,
        vcFileName,
        docIndex
      );
    } catch (error) {
      console.error(
        `Failed to decode VC for document ${docIndex} in ${identifier}:`,
        error
      );
      // Fallback: Save raw base64 content
      saveFallbackDocument(file, folder, docIndex);
    }
  };

  // Helper function to process documents
  const processApplicationDocuments = async (
    files: any[],
    folder: JSZip,
    identifier: string
  ) => {
    for (let j = 0; j < files.length; j++) {
      const file = files[j];
      try {
        if (file.fileContent) {
          await processVCDocument(file, folder, j, identifier);
        } else if (file.filePath?.startsWith("http")) {
          const documentBlob = await downloadDocumentFromUrl(file.filePath);
          const documentName = extractFilename(file.filePath);
          const sanitizedName = sanitizeFileName(documentName);
          folder.file(`${j + 1}_${sanitizedName}`, documentBlob);
        } else {
          console.warn(
            `No valid file content or path for document ${j} in ${identifier}`
          );
        }
      } catch (error) {
        console.error(
          `Failed to add document ${j} for application ${identifier}:`,
          error
        );
      }
    }
  };

  // Helper function to process single application
  const processApplication = async (
    application: any,
    zip: JSZip,
    index: number,
    total: number
  ) => {
    const identifier =
      application.orderId || application.id || `application_${index + 1}`;
    const folderName = sanitizeFileName(identifier);
    const applicationFolder = zip.folder(folderName);

    if (!applicationFolder) {
      console.error(`Failed to create folder for ${identifier}`);
      return;
    }

    setProgress(((index + 1) / total) * 100);
    setStatusText(`Processing application ${index + 1} of ${total}...`);

    // Add CSV
    addApplicationCSV(
      applicationFolder,
      application.applicationData || application,
      identifier
    );

    // Process documents
    const files = application.applicationFiles || application.files || [];
    await processApplicationDocuments(files, applicationFolder, identifier);
  };

  const handleDownloadZip = async () => {
    setIsLoading(true);
    setProgress(0);
    setStatusText("Fetching applications...");

    try {
      const applications = await fetchAllApplicationsWithDocuments({
        benefitId,
        status: selectedStatus || undefined,
      });

      if (!applications?.length) {
        toast({
          title: "No applications found",
          description: "There are no applications to download.",
          status: "warning",
          duration: 4000,
          isClosable: true,
        });
        setIsLoading(false);
        return;
      }

      setStatusText(`Processing ${applications.length} applications...`);
      const zip = new JSZip();

      // Process each application
      for (let i = 0; i < applications.length; i++) {
        await processApplication(applications[i], zip, i, applications.length);
      }

      // Generate and download the ZIP file
      setStatusText("Generating ZIP file...");
      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 6,
        },
      });

      const safeBenefitName = sanitizeFileName(benefitName);
      const timestamp = new Date().toISOString().split("T")[0];
      const fileName = `${safeBenefitName}_applications_${timestamp}.zip`;

      saveAs(zipBlob, fileName);

      toast({
        title: "ZIP downloaded successfully",
        description: `Downloaded ${applications.length} applications with documents.`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Error downloading ZIP:", err);
      toast({
        title: "Failed to download ZIP",
        description:
          err instanceof Error ? err.message : "An unknown error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      setProgress(0);
      setStatusText("");
    }
  };

  return (
    <>
      <Button
        leftIcon={isLoading ? <Spinner size="sm" /> : <DownloadIcon />}
        colorScheme="green"
        onClick={handleDownloadZip}
        isDisabled={isLoading}
        width="200px"
      >
        {isLoading ? "Processing..." : "Download as ZIP"}
      </Button>
      {isLoading && (
        <Flex direction="column" mt={2} width="200px">
          <Progress value={progress} size="sm" colorScheme="green" mb={1} />
          <Text fontSize="xs" color="gray.600">
            {statusText}
          </Text>
        </Flex>
      )}
    </>
  );
};

export default DownloadZIP;
