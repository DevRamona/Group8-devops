import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

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

const FarmerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarmer = async () => {
      if (!id) return;

      try {
        const response = await fetch(`http://localhost:5000/api/farmers/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch farmer');
        }
        const data = await response.json();
        setFarmer(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFarmer();
  }, [id]);

  if (loading) {
    return <div>Loading farmer profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!farmer) {
    return <div>Farmer not found.</div>;
  }

  return (
    <div>
      <h2>Farmer Profile</h2>
      <div className="profile-container">
        {farmer.profilePicture && (
          <div className="profile-picture-container">
            <img
              src={farmer.profilePicture}
              alt={`${farmer.name}'s profile`}
              className="profile-picture"
            />
          </div>
        )}
        <div className="profile-info">
          <h3>{farmer.name}</h3>
          <p><strong>Email:</strong> {farmer.email}</p>
          {farmer.phoneNumber && <p><strong>Phone:</strong> {farmer.phoneNumber}</p>}
          <p><strong>Joined:</strong> {new Date(farmer.createdAt).toLocaleDateString()}</p>
          <p><strong>ID:</strong> {farmer.id}</p>
          {farmer.location && <p><strong>Location:</strong> {farmer.location}</p>}
          {farmer.farmSize && <p><strong>Farm Size:</strong> {farmer.farmSize} hectares</p>}
          {farmer.crops && <p><strong>Crops:</strong> {farmer.crops}</p>}
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
