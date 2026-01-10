import type { ModalContent } from "../context/ModalContext";

export function getModalTitle(content: ModalContent): string {
  switch (content.type) {
    case "create-booking":
      return "Create New Booking";
    case "view-booking":
      return "Booking Details";
    case "edit-booking":
      return "Edit Booking";
    default:
      return "";
  }
}
