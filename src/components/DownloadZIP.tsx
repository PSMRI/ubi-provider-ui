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

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "pdf", "jfif"];


const DownloadZIP: React.FC<DownloadZIPProps> = ({
  benefitId,
  benefitName,
  selectedStatus = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const toast = useToast();

  const sanitizeFileName = (name: string | number) =>
    String(name)
      .replaceAll(/[\\/:*?"<>|]/g, "_")
      .replaceAll(/\s+/g, "_");

  const getFileExtension = (contentType?: string, filename?: string) => {
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

  const extractFilename = (path: string) => path.split("/").pop() || "document";

  const base64ToBlob = (base64: string, contentType: string = "") => {
    const base64Data = base64.includes(",") ? base64.split(",")[1] : base64;
    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: contentType });
    } catch (error) {
      console.error("Failed to decode base64:", error);
      throw new Error("Invalid base64 string");
    }
  };

  interface DocRecord {
    documentSubtype: string;
    doc_type: string;
    path: string;
  }

  const addDocRecord = (
    fileName: string,
    folderName: string,
    docRecords: DocRecord[],
    documentSubtype: string,
    doc_type: string
  ) => {
    const fullPath = `/${folderName}/${fileName}`;

    // Check if a record with the same subtype and doc_type already exists
    const existingRecord = docRecords.find(
      (record) =>
        record.documentSubtype === documentSubtype &&
        record.doc_type === doc_type
    );

    if (existingRecord) {
      // Do nothing, we only want one path per unique document subtype/type pair
      return;
    } else {
      docRecords.push({
        documentSubtype,
        doc_type,
        path: fullPath,
      });
    }
  };

  const isAllowedExtension = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    // Only allow specific extensions, excluding JSON implicitly by omission
    return ext && IMAGE_EXTENSIONS.includes(ext);
  };

  const downloadVCImages = async (
    credentialSubject: any,
    folder: JSZip,
    vcFileName: string,
    docIndex: number,
    docRecords: DocRecord[],
    folderName: string,
    parentSubtype: string,
    parentDocType: string
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

          // Check extension before adding
          if (IMAGE_EXTENSIONS.includes(imageExt.toLowerCase())) {
            const imageName = `${docIndex + 1}_${vcFileName}_image_${imageCounter + 1
              }.${imageExt}`;
            folder.file(imageName, imageBlob);
            addDocRecord(imageName, folderName, docRecords, parentSubtype, parentDocType);
            imageCounter++;
          }
        } catch (error) {
          console.error(`Failed to download image from ${urlValue}:`, error);
        }
      }
    }
  };

  const saveFallbackDocument = (
    file: any,
    folder: JSZip,
    docIndex: number,
    docRecords: DocRecord[],
    folderName: string
  ) => {
    console.log("file", file);
    const contentType =
      file.fileType || file.documentType || "application/octet-stream";
    const documentBlob = base64ToBlob(file.fileContent, contentType);
    let documentName =
      file.documentName ||
      file.documentSubtype ||
      extractFilename(file.filePath || `document_${docIndex + 1}`);

    if (!documentName.includes(".")) {
      documentName = `${documentName}.${getFileExtension(
        contentType,
        file.filePath
      )}`;
    }

    // Filter check
    if (!isAllowedExtension(documentName)) {
      return;
    }

    const sanitizedName = sanitizeFileName(documentName);
    folder.file(`${docIndex + 1}_${sanitizedName}`, documentBlob);
    addDocRecord(
      `${docIndex + 1}_${sanitizedName}`,
      folderName,
      docRecords,
      file.documentSubtype || "Document",
      file.documentType || file.doc_type || "Document"
    );
  };

  const processVCDocument = async (
    file: any,
    folder: JSZip,
    docIndex: number,
    identifier: string,
    docRecords: DocRecord[],
    folderName: string
  ) => {
    try {
      const decodedVC = decodeBase64ToJson(file.fileContent);
      const vcFileName = sanitizeFileName(
        file.documentSubtype || `document_${docIndex + 1}`
      );
      // NOTE: We do NOT add the VC JSON file to the folder or docRecords as per request 
      // "not add json files... take files with this extentions only"
      // But we DO parse it to extract images.

      // const vcFile = `${docIndex + 1}_${vcFileName}_vc.json`;
      // folder.file(vcFile, JSON.stringify(decodedVC, null, 2));
      // addDocRecord(vcFile, folderName, docRecords, "Verifiable Credential", "VC");

      await downloadVCImages(
        decodedVC?.credentialSubject,
        folder,
        vcFileName,
        docIndex,
        docRecords,
        folderName,
        file.documentSubtype || "Verifiable Credential",
        file.documentType || "VC"
      );
    } catch (error) {
      console.error(
        `Failed to decode VC for document ${docIndex} in ${identifier}:`,
        error
      );
      saveFallbackDocument(file, folder, docIndex, docRecords, folderName);
    }
  };

  const processApplicationDocuments = async (
    files: any[],
    folder: JSZip,
    identifier: string,
    docRecords: DocRecord[],
    folderName: string
  ) => {
    for (let j = 0; j < files.length; j++) {
      const file = files[j];
      try {
        if (file.fileContent) {
          await processVCDocument(
            file,
            folder,
            j,
            identifier,
            docRecords,
            folderName
          );
        } else if (file.filePath?.startsWith("http")) {
          const documentName = sanitizeFileName(extractFilename(file.filePath));

          if (isAllowedExtension(documentName)) {
            const documentBlob = await downloadDocumentFromUrl(file.filePath);
            folder.file(`${j + 1}_${documentName}`, documentBlob);
            addDocRecord(
              `${j + 1}_${documentName}`,
              folderName,
              docRecords,
              file.documentSubtype || "Document",
              file.documentType || file.doc_type || "Document"
            );
          }
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

  const processApplication = async (
    application: any,
    zip: JSZip,
    index: number,
    total: number,
    applicationsDataForCSV: any[]
  ) => {
    const applicationId = application.id || "";
    const orderId = application.orderId || "";
    const identifier = orderId || applicationId || `application_${index + 1}`;
    const folderName = sanitizeFileName(identifier);
    const applicationFolder = zip.folder(folderName);

    if (!applicationFolder) {
      console.error(`Failed to create folder for ${identifier}`);
      return;
    }

    setProgress(((index + 1) / total) * 100);
    setStatusText(`Processing application ${index + 1} of ${total}...`);

    const docRecords: DocRecord[] = [];

    // Process documents
    const files = application.applicationFiles || application.files || [];
    await processApplicationDocuments(
      files,
      applicationFolder,
      identifier,
      docRecords,
      folderName
    );

    // Prepare rows for root-level applications_data.csv
    const appData = application.applicationData || application;

    // Construct dynamic data part
    const dynamicData: Record<string, any> = {};
    Object.keys(appData).forEach(key => {
      if (appData[key] !== null && typeof appData[key] !== 'object') {
        dynamicData[key] = appData[key];
      }
    });

    const commonFixedData = {
      Sno: index + 1,
      "Order Id": orderId,
      Status: application.status || "",
    };

    if (docRecords.length > 0) {
      docRecords.forEach((doc, i) => {
        let rowData: any;

        if (i === 0) {
          // First row: Full data (Fixed + Dynamic + Doc)
          rowData = {
            ...commonFixedData,
            ...dynamicData,
            documentSubtype: doc.documentSubtype,
            doc_type: doc.doc_type,
            Path: doc.path
          };
        } else {
          // Subsequent rows: Only Doc data, others empty
          // We explicitly set fixed columns to "" to ensure alignment if they are initialized
          // Dynamic keys are omitted, so they will default to "" in CSV generation
          rowData = {
            Sno: "",
            "Order Id": "",
            Status: "",
            documentSubtype: doc.documentSubtype,
            doc_type: doc.doc_type,
            Path: doc.path
          };
        }
        applicationsDataForCSV.push(rowData);
      });
    } else {
      // No documents, push one row with empty document fields but full app data
      const rowData = {
        ...commonFixedData,
        ...dynamicData,
        documentSubtype: "",
        doc_type: "",
        Path: "",
      };
      applicationsDataForCSV.push(rowData);
    }
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
      const applicationsDataForCSV: any[] = [];

      for (let i = 0; i < applications.length; i++) {
        await processApplication(
          applications[i],
          zip,
          i,
          applications.length,
          applicationsDataForCSV
        );
      }

      // Generate root-level applications_data.csv
      if (applicationsDataForCSV.length > 0) {
        // Collect all keys from all rows to ensure we capture every dynamic field
        const allKeys = new Set<string>();
        applicationsDataForCSV.forEach(row => Object.keys(row).forEach(k => allKeys.add(k)));

        // Define fixed headers
        const fixedStart = ["Sno", "Order Id"];
        const fixedEnd = ["Status", "documentSubtype", "doc_type", "Path"];

        // Filter out fixed headers from the collected keys to get dynamic ones
        const dynamicHeaders = Array.from(allKeys).filter(k =>
          !fixedStart.includes(k) && !fixedEnd.includes(k)
        );

        // Construct final header order
        const headers = [...fixedStart, ...dynamicHeaders, ...fixedEnd];

        const rows = applicationsDataForCSV.map((app) =>
          headers
            .map((h) => {
              const val = app[h];
              if (val === undefined || val === null) return "";
              const stringValue = String(val);
              return stringValue.includes(",") || stringValue.includes("\n")
                ? `"${stringValue.replaceAll(/"/g, '""')}"`
                : stringValue;
            })
            .join(",")
        );
        zip.file(
          "applications_data.csv",
          "\uFEFF" + [headers.join(","), ...rows].join("\n")
        );
      }

      setStatusText("Generating ZIP file...");
      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      const safeBenefitName = sanitizeFileName(benefitName);
      const timestamp = new Date().toISOString().split("T")[0];
      saveAs(zipBlob, `${safeBenefitName}_applications_${timestamp}.zip`);

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
          <Text fontSize="xs" color="gray.600">{statusText}</Text>
        </Flex>
      )}
    </>
  );
};

export default DownloadZIP;
