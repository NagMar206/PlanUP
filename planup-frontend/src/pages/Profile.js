import React, { useState } from "react";
import axios from "axios";

const Profile = () => {
  const [name, setName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to handle name update
  const handleUpdateName = async () => {
    try {
      const response = await axios.put("/api/user/update-name", { name });
      alert("Sikeresen frissítetted a nevedet!");
    } catch (error) {
      console.error("Nem sikerült frissíteni a nevedet:", error);
      alert("Nem sikerült frissíteni a nevedet. Kérjük próbálja újra később!");
    }
  };

  // Function to handle profile deletion
  const handleDeleteProfile = async () => {
    if (!window.confirm("Biztos hogy törölni szeretnéd a profilodat? Ez később nem lesz visszavonható!")) {
      return;
    }

    setIsDeleting(true);

    try {
      await axios.delete("/api/user/delete-profile");
      alert("Profil sikeresen törölve. Visszairányítás a főoldalra...");
      window.location.href = "/"; // Redirect to homepage after deletion
    } catch (error) {
      console.error("Nem sikerült törölni a profilt:", error);
      alert("Nem sikerült törölni a profilt. Kérjük próbálja újra később!");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <Card className="w-full max-w-md p-4">
        <CardContent>
          <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>

          {/* Update Name Section */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Update Your Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Irja be a nevét"
              className="mt-1 w-full"
            />
            <Button onClick={handleUpdateName} className="mt-3 w-full">
              Név frissítése
            </Button>
          </div>

          {/* Delete Profile Section */}
          <div className="mt-6 border-t pt-4">
            <h2 className="text-lg font-medium text-red-600 mb-2">Delete Profile</h2>
            <p className="text-sm text-gray-600 mb-4">
              Warning: Deleting your profile is permanent and cannot be undone.
            </p>
            <Button
              onClick={handleDeleteProfile}
              className="w-full bg-red-600 text-white hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Törlés..." : "Profil törlése"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


export default Profile;
