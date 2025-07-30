import {
  Page,
  Layout,
  Card,
  TextContainer,
  LegacyStack,
  Badge,
  Tag,
  DataTable,
  ResourceList,
  ResourceItem,
  Thumbnail,
  Box,
  BlockStack,
  Button,
  ButtonGroup,
  InlineGrid,
  Text,
} from "@shopify/polaris";


export default function ProductResults(props) {
  const { product, pushResource } = props;
  return (
    // <Page
    //   title={product.title}
    //   primaryAction={{ content: 'Edit in Shopify', url: `https://your-shop.myshopify.com/admin/products/${product.shopify_id}`, external: true }}
    // >
    <BlockStack spacing="loose">
      <Box padding="400"></Box>
      <Layout>
        {/* Basic Info */}
        <Layout.Section oneHalf>
          <BlockStack gap="200">
            <Card sectioned title="Details">
              <TextContainer spacing="loose">
                <p>
                  <strong>MK ID:</strong> {product.mk_id}
                </p>
                <p>
                  <strong>Status:</strong> <Badge>{product.status}</Badge>
                </p>
                <p>
                  <strong>Vendor:</strong> {product.vendor || "–"}
                </p>
                <p>
                  <strong>Type:</strong> {product.product_type || "–"}
                </p>
                <p>
                  <strong>Tags:</strong>{" "}
                  {product.tags
                    ? product.tags.split(",").map((t) => <Tag key={t}>{t}</Tag>)
                    : "–"}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(product.created_at).toLocaleString()}
                </p>
                <p>
                  <strong>Updated:</strong>{" "}
                  {new Date(product.updated_at).toLocaleString()}
                </p>
              </TextContainer>
            </Card>

            <Card sectioned title="Description">
              <Box>
                <p>
                  <strong>Description</strong>
                </p>
                <div dangerouslySetInnerHTML={{ __html: product.body_html }} />
              </Box>
            </Card>
          </BlockStack>
        </Layout.Section>

        {/* Options & Variants */}
        <Layout.Section oneHalf>
          <BlockStack gap="200">
            <Card sectioned title="Options">
              <LegacyStack vertical spacing="tight">
                <TextContainer>
                  <p>
                    <strong>Colors:</strong> {product.option_colors}
                  </p>
                  <p>
                    <strong>Sizes:</strong> {product.option_sizes}
                  </p>
                </TextContainer>
              </LegacyStack>
            </Card>

            <Card sectioned>
              <InlineGrid columns="1fr auto">
                <Text as="h2" variant="headingSm">
                Variants
                </Text>
                <ButtonGroup>
                  <Button variant="primary" onClick={() => pushResource('allVariants')}>Update all variants</Button>
                </ButtonGroup>
              </InlineGrid>
              <DataTable
                columnContentTypes={["text", "text", "text", "text", "text", "text"]}
                headings={["SKU", "Price", "Color", "Size", "Shopify ID", "Action"]}
                rows={product.variants.map((v) => [
                  <ResourceList.Item
                    id={v.id}
                    accessibilityLabel={`View details for ${v.sku}`}
                    key={v.id}
                  >
                    <LegacyStack alignment="center" spacing="tight">
                      {v.image && (
                        <Thumbnail source={v.image} alt={v.sku} size="small" />
                      )}
                      <span>{v.sku}</span>
                    </LegacyStack>
                  </ResourceList.Item>,
                  `$${v.price}`,
                  v.option_color,
                  v.option_size,
                  v.shopify_id,
                  <Button onClick={() => pushResource("variant", v.id)}>Update Variant</Button>
                ])}
              />
            </Card>
          </BlockStack>
        </Layout.Section>

        {/* Metafields */}
        <Layout.Section>
          <BlockStack gap="200">
            <Card sectioned>
              <InlineGrid columns="1fr auto">
                <Text as="h2" variant="headingSm">
                Metafields
                </Text>
                <ButtonGroup>
                  <Button variant="primary" onClick={() => pushResource('productMetafields')}>Update productMetafields</Button>
                </ButtonGroup>
              </InlineGrid>
              <DataTable
                columnContentTypes={["text", "text", "text"]}
                headings={["Field", "Value", "Type"]}
                rows={Object.entries(product.metafields[0] || {}).map(
                  ([field, value]) => {
                    const displayValue =
                      typeof value === "boolean"
                        ? String(value)
                        : value === null
                        ? ""
                        : value;
                    const typeLabel = Array.isArray(value)
                      ? "array"
                      : value === null
                      ? "null"
                      : typeof value;

                    return [field, displayValue, typeLabel];
                  }
                )}
              />
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
      <Box padding="400"></Box>
    </BlockStack>
    // </Page>
  );
}
