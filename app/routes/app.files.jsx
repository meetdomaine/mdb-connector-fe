import {
  Page,
  Card,
  IndexTable,
  Text,
  Button,
  Spinner,
  Pagination
} from "@shopify/polaris";
import { useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";

export default function Files() {
  const shopify = useAppBridge();

  const [files, setFiles] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [toastData, setToastData] = useState(null);

  const loadFiles = async (page = 1) => {
    setLoading(true);
    const res = await fetch(`https://gmdhhrbksfarato5ysfgvy2llq0ywwow.lambda-url.us-west-2.on.aws/api/files?page=${page}`);
    const json = await res.json();

    setFiles(json.data || []);
    setPagination({
      currentPage: json.current_page,
      hasNextPage: json.current_page < json.last_page,
      hasPreviousPage: json.current_page > 1,
    });

    setLoading(false);
  };

  const triggerProcess = async (action) => {
    await fetch(`https://gmdhhrbksfarato5ysfgvy2llq0ywwow.lambda-url.us-west-2.on.aws/api/files/process/${action}`, { method: "POST" });
    await loadFiles();
    showToast(action);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  function showToast(action) {
    // Perform actions when the primary button is clicked
    shopify.toast.show(`Processing : ${action} files.`);
  }

  return (
    <>
    <Page title="Files Tab"
    secondaryActions={[
      {
        content: 'Process Catalog Files',
        accessibilityLabel: 'Secondary action label',
        onAction: () => triggerProcess('catalog')
      },
      {
        content: 'Process Actions Files',
        onAction: () => triggerProcess('action')
      },
    ]}>
      <Card>
        {loading ? (
          <Spinner accessibilityLabel="Loading files" size="large" />
        ) : (
          <IndexTable
            resourceName={{ singular: "file", plural: "files" }}
            itemCount={files.length}
            selectable={false}
            headings={[
              { title: "File name" },
              { title: "Total Rows" },
              { title: "Rows Processed" },
              { title: "Complete" },
            ]}
          >
            {files.map((file, index) => (
              <IndexTable.Row id={file.id} key={file.id} position={index}>
                <IndexTable.Cell>
                  <Text>{file.filename}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>{file.total_rows}</IndexTable.Cell>
                <IndexTable.Cell>{file.row_processed}</IndexTable.Cell>
                <IndexTable.Cell>
                  {file.total_rows === file.row_processed ? "✅" : "❌"}
                </IndexTable.Cell>
              </IndexTable.Row>
            ))}
          </IndexTable>
        )}
        <div
           style={{
              width: '100%',
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '20px',
              margin: 'auto',
           }}
         >
        <Pagination
           onPrevious={() => loadFiles(pagination.currentPage - 1)}
           onNext={() => loadFiles(pagination.currentPage + 1)}
           hasPrevious={pagination.hasPreviousPage}
           hasNext={pagination.hasNextPage}
           label={`Page ${pagination.currentPage}`}
         />
      </div>
      </Card>
    </Page>
    </>
  );
}
