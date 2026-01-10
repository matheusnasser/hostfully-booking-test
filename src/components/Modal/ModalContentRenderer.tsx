import type { ModalContent } from "../../context/ModalContext";
import BookingDetails from "../Booking/BookingDetails";
import BookingForm from "../Booking/BookingForm";

export function ModalContentRenderer({ content }: { content: ModalContent }) {
  switch (content.type) {
    case "create-booking":
      return <BookingForm mode="create" property={content.property} />;

    case "view-booking":
      return <BookingDetails booking={content.booking} />;

    case "edit-booking":
      return <BookingForm mode="edit" booking={content.booking} />;

    default:
      return null;
  }
}
