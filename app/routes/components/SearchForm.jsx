import { TextField, Button, InlineStack, Box } from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";

export default function SearchForm({ mkId, setMkId, onSearch, loading }) {
  return (
    <InlineStack gap="100" blockAlign="center" align="space-between">
      <Box width="90%">
        <TextField
          label="Product MK ID"
          value={mkId}
          onChange={setMkId}
          autoComplete="off"
        />
      </Box>
      <Box paddingBlockStart="600" width="9%">
        <Button
          icon={SearchIcon}
          onClick={onSearch}
          loading={loading}
          variant="primary"
        >
          Search
        </Button>
      </Box>
    </InlineStack>
  );
}
