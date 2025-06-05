export default async function CheckPointsPage({
  params,
}: {
  params: { vintageId: string };
}) {
  const vintageId = parseInt(params.vintageId, 10);
  return <>{vintageId}</>;
}
