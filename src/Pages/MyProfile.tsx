import { useState } from "react";
import PersonalInfoForm from "../Components/MyProfile/PersonalInfoForm";
import DocumentUpload from "../Components/MyProfile/DocumentIpload";
import ChangePasswordForm from "../Components/MyProfile/ChangePasswordForm";
import Sidebar from "../Components/MyProfile/SideBar";


const MyProfile = () => {
  const [selected, setSelected] = useState("Personal info");

  const renderContent = () => {
    switch (selected) {
      case "Personal info":
        return <PersonalInfoForm />;
      case "Documents":
        return <DocumentUpload />;
      case "Change password":
        return <ChangePasswordForm />;
      default:
        return <div className="p-4">Reviews Section</div>;
    }
  };

  return (
    <div className="min-h-screen  p-8 font-sans ">
      <div className="flex gap-12 max-[800px]:flex-col max-[800px]:gap-1">
        <Sidebar selected={selected} onSelect={setSelected} />
        <div className="flex-1">{renderContent()}</div>
      </div>
    </div>
  );
};

export default MyProfile;
