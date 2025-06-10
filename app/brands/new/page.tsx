import New from "./clients/components/New";

export default async function NewPage({
  params,
}: {
  params: {
    brandId: string;
  };
}) {
  const brandId = parseInt(params.brandId, 10);

  return <New brandId={brandId} />;
}
