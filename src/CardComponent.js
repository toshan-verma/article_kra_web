import React from 'react';
import './CardComponent'; // Import the CSS file for the card styles

const CardComponent = ({ image, name, description }) => {
    return (
      <div className="card">
        <div className="card-image">
          <img src={image} alt={name} />
        </div>
        <div className="card-content">
          <h2>{name}</h2>
          <p>{description}</p>
        </div>
      </div>
    );
  };

export default CardComponent;
