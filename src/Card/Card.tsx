import './Card.css';

const appletv_icon = 'https://graphql-sandbox-gules.vercel.app/appletv_icon.png';
const hulu_icon = 'https://graphql-sandbox-gules.vercel.app/hulu_icon.jpg';

export const Card = ({ title, description, brand, image }) => {
  // TODO: use typescript to enforce string literal of brands?
  const icon_src = brand === 'Apple Tv' ? appletv_icon : hulu_icon;
  return (
    <div className="card">
      <div className="thumbnail-container">
        <img src={image} className="thumbnail-img" alt={title} />
        <img src={icon_src} className="brand-img" alt={brand} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};
