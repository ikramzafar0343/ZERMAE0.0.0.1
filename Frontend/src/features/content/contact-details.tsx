import { IconEnvelope, IconMap, IconPhone } from "@/components/icons/icons";
import { SUPPORT_EMAIL, supportWhatsAppUrlFromPhone } from "@/constants/site";

type ContactDetailsProps = {
  supportPhone?: string;
  officeAddress?: string;
  showAddress?: boolean;
};

export function ContactDetails({
  supportPhone,
  officeAddress = "",
  showAddress = false,
}: ContactDetailsProps) {
  const whatsapp = supportWhatsAppUrlFromPhone(supportPhone);
  const address = officeAddress.trim();
  return (
    <ul className="info-page-contact-list">
      {showAddress && address ? (
        <li className="info-page-contact-item">
          <IconMap className="info-page-contact-icon" />
          <div>
            <p className="info-page-contact-label">Visit</p>
            <p className="info-page-contact-value">{address}</p>
          </div>
        </li>
      ) : null}
      <li className="info-page-contact-item">
        <IconPhone className="info-page-contact-icon" />
        <div>
          <p className="info-page-contact-label">WhatsApp</p>
          <p className="info-page-contact-value">
            <a href={whatsapp} target="_blank" rel="noreferrer" className="info-page-link">
              Chat on WhatsApp
            </a>
          </p>
        </div>
      </li>
      <li className="info-page-contact-item">
        <IconEnvelope className="info-page-contact-icon" />
        <div>
          <p className="info-page-contact-label">Email</p>
          <p className="info-page-contact-value">
            <a href={`mailto:${SUPPORT_EMAIL}`} className="info-page-link">
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>
      </li>
    </ul>
  );
}
