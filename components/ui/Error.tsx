import Link from "next/link";

interface ErrorProps {
  msg?: string;
  returnUrl?: string;
  returnUrlLabel?: string;
}

const Error = ({
  msg = "エラーが発生しました。",
  returnUrl = "/",
  returnUrlLabel = "TOP",
}: ErrorProps) => {
  return (
    <div className="error-page-container">
      <p className="error-page-message">{msg}</p>
      <Link href={returnUrl} className="error-page-link">
        {returnUrlLabel}
      </Link>
    </div>
  );
};

export default Error;
