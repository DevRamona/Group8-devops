import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Farmer {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  location?: string;
  farmSize?: number;
  crops?: string;
  profilePicture?: string;
  phoneNumber?: string;
}

const FarmerList: React.FC = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await fetch('/api/farmers');
        if (!response.ok) {
          throw new Error('Failed to fetch farmers');
        }
        const data = await response.json();
        setFarmers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  if (loading) {
    return <div>Loading farmers...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Farmers List</h2>
      {farmers.length === 0 ? (
        <p>No farmers found.</p>
      ) : (
        <div className="farmers-grid">
          {farmers.map((farmer) => (
            <Link key={farmer.id} to={`/farmer/${farmer.id}`} className="farmer-card-link">
              <div className="farmer-card">
                {farmer.profilePicture && (
                  <img
                    src={farmer.profilePicture}
                    alt={`${farmer.name} profile`}
                    className="farmer-profile-pic"
                  />
                )}
                <h3>{farmer.name}</h3>
                <p><strong>Email:</strong> <a href={`mailto:${farmer.email}`} className="email-link">{farmer.email}</a></p>
                {farmer.phoneNumber && <p><strong>Phone:</strong> <a href={`tel:${farmer.phoneNumber}`} className="phone-link">{farmer.phoneNumber}</a></p>}
                <p><strong>Joined:</strong> {new Date(farmer.createdAt).toLocaleDateString()}</p>
                {farmer.location && <p><strong>Location:</strong> {farmer.location}</p>}
                {farmer.farmSize && <p><strong>Farm Size:</strong> {farmer.farmSize} hectares</p>}
                {farmer.crops && <p><strong>Crops:</strong> {farmer.crops}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmerList;
