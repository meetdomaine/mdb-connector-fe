import { Page } from "@shopify/polaris";
import { useState, useCallback } from "react";
import SearchForm from "./components/SearchForm";
import ProductResults from "./components/ProductResults";
import { useAppBridge } from "@shopify/app-bridge-react";

export default function ProductSearch() {
  const shopify = useAppBridge();

  const [mkId, setMkId] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastData, setToastData] = useState(null);
  console.log(mkId);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      console.log(mkId);
      const res = await fetch("https://gmdhhrbksfarato5ysfgvy2llq0ywwow.lambda-url.us-west-2.on.aws/api/products/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mkId: mkId }),
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setProduct(data.product);
      } else {
        const err = await res.text();
        showToast(
          "Internal error",
          {
          duration: 3000,
          isError: true,
        });
      }
    } catch (e) {
      showToast(
        "Internal error",
        {
        duration: 3000,
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  }, [mkId]);

  function showToast(message, toastOpts) {
    // Perform actions when the primary button is clicked
    shopify.toast.show(message, toastOpts);
  }

  const pushResource = useCallback(async (type = "product", variantId = null) => {
    setLoading(true);
    console.log("pushResource", type, variantId);
    try {
      const res = await fetch("https://gmdhhrbksfarato5ysfgvy2llq0ywwow.lambda-url.us-west-2.on.aws/api/products/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mkId: mkId,
          type: type,
          variantId: variantId,
        }),
      });
      if (res.ok) {
        showToast(`Action for ID: ${mkId} dispatched`, {
          duration: 3000
        });
      } else {
        const err = await res.text();
         showToast(`Internal error ${err}`, {
           duration: 3000,
          isError: true,
        });
      }
    } catch (e) {
      showToast(`Internal error ${e}`, {
        duration: 3000,
       isError: true,
      });
    } finally {
      setLoading(false);
    }
  }, [product]);

  console.log(product);
  return (
    <>
      <Page
        title={product ? product.title : "Product Search"}
        primaryAction={
          product
            ? {
                content: "Update Product",
                disabled: loading,
                onAction: () => pushResource(),
              }
            : null
        }
      >
        <SearchForm
          mkId={mkId}
          setMkId={setMkId}
          onSearch={handleSearch}
          loading={loading}
        />
        {product ? <ProductResults product={product} pushResource={pushResource} /> : <></>}
      </Page>
    </>
  );
}
