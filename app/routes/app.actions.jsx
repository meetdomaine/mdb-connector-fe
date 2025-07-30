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
// import { useAuthenticatedFetch } from "../hooks";
// import { Toast } from "@shopify/app-bridge-react";

export default function Actions() {
  // const fetch = useAuthenticatedFetch();
  const [actions, setActions] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(false);
  const [toastData, setToastData] = useState(null);

  const loadActions = async (page = 1) => {
    // setLoading(true);
    const res = await fetch(`https://gmdhhrbksfarato5ysfgvy2llq0ywwow.lambda-url.us-west-2.on.aws/api/actions?page=${page}`);
    const json = await res.json();

    setActions(json.data || []);
    setPagination({
      currentPage: json.current_page,
      hasNextPage: json.current_page < json.last_page,
      hasPreviousPage: json.current_page > 1,
    });

    // setLoading(false);
  };

  // const triggerProcess = async (id) => {
  //   await fetch(`/api/actions/process/${id}`, { method: "POST" });
  //   await loadFiles();
  //   setToastData({
  //     content: `Processing : ${id} files.`,
  //     duration: 3000,
  //     isError: false,
  //   });
  // };

  useEffect(() => {
    loadActions();
  }, []);

  return (
    <>
    <Page title="Actions Tab">
      <Card>
        {loading ? (
          <Spinner accessibilityLabel="Loading actions" size="large" />
        ) : (
          <IndexTable
            resourceName={{ singular: "action", plural: "actions" }}
            itemCount={actions.length}
            selectable={false}
            headings={[
              { title: "MK ID" },
              { title: "Action" },
              { title: "Values" },
              { title: "Processed" },
              { title: "Result" },
            ]}
          >
            {actions.map((action, index) => (
              <IndexTable.Row id={action.id} key={action.id} position={index}>
                <IndexTable.Cell>
                  <Text>{action.mk_id}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>{action.action}</IndexTable.Cell>
                <IndexTable.Cell>{action.values}</IndexTable.Cell>
                <IndexTable.Cell>
                  {action.processed ? "✅" : "❌"}
                </IndexTable.Cell>
                <IndexTable.Cell>{action.result}</IndexTable.Cell>
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
           onPrevious={() => loadActions(pagination.currentPage - 1)}
           onNext={() => loadActions(pagination.currentPage + 1)}
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
