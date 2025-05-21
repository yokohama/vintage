import Link from "next/link";

interface NotFoundProps {
  msg?: string;
  returnUrl?: string;
  returnUrlLabel?: string;
}

const NotFound = ({
  msg = "アイテムが見つかりませんでした。",
  returnUrl = "/",
  returnUrlLabel = "TOP",
}: NotFoundProps) => {
  return (
    <div className="error-page-container">
      <p className="error-page-message">{msg}</p>
      <Link href={returnUrl} className="error-page-link">
        {returnUrlLabel}
      </Link>
    </div>
  );
};

export default NotFound;
