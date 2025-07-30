import {
  Page,
  Card,
  IndexTable,
  Text,
  Spinner,
  Pagination
} from "@shopify/polaris";
import { useEffect, useState } from "react";

export default function QueuedUpdates() {
  const [queues, setQueues] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(true);


  const loadQueues = async (page = 1) => {
    setLoading(true);
    const res = await fetch(`https://gmdhhrbksfarato5ysfgvy2llq0ywwow.lambda-url.us-west-2.on.aws/api/queue-updates?page=${page}`);
    const json = await res.json();

    setQueues(json.data || []);
    setPagination({
      currentPage: json.current_page,
      hasNextPage: json.current_page < json.last_page,
      hasPreviousPage: json.current_page > 1,
    });

    setLoading(false);
  };

  useEffect(() => {
    loadQueues();
  }, []);

  return (
    <>
    <Page title="Queued Updates Tab">
      <Card>
        {loading ? (
          <Spinner accessibilityLabel="Loading queued updates" size="large" />
        ) : (
          <IndexTable
            resourceName={{ singular: "queues update", plural: "queues updates" }}
            itemCount={queues.length}
            selectable={false}
            headings={[
              { title: "MK ID" },
              { title: "Model" },
              { title: "Fields" },
              { title: "Processed" },
              { title: "Result" },
            ]}
          >
            {queues.map((queueItem, index) => (
              <IndexTable.Row id={queueItem.id} key={queueItem.id} position={index}>
                <IndexTable.Cell>
                  <Text>{queueItem.mk_id}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>{queueItem.model}</IndexTable.Cell>
                <IndexTable.Cell>{queueItem.fields}</IndexTable.Cell>
                <IndexTable.Cell>
                  {queueItem.processed ? "✅" : "❌"}
                </IndexTable.Cell>
                <IndexTable.Cell>{queueItem.result}</IndexTable.Cell>
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
           onPrevious={() => loadQueues(pagination.currentPage - 1)}
           onNext={() => loadQueues(pagination.currentPage + 1)}
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
