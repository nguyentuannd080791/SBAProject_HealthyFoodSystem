import { ShoppingBagIcon } from "../../../shared/components/Icons";

export function OrderPageHeader({ eyebrow, title, description, children }) {
  return <header className="order-page-header">
    <div className="order-header-copy"><span className="order-header-icon" aria-hidden="true"><ShoppingBagIcon size={25} /></span>
      <div><div className="order-eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>
    </div>
    {children && <div className="order-header-action">{children}</div>}
  </header>;
}
