import ReCAPTCHA from "react-google-recaptcha";

const RecaptchaComponent = ({
  onChange,
}: {
  onChange: (token: string | null) => void;
}) => {
  return (
    <ReCAPTCHA
      sitekey={process.env.NEXT_PUBLIC_SITE_KEY!}
      onChange={onChange}
    />
  );
};

export default RecaptchaComponent;
