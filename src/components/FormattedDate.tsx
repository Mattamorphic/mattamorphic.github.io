import React from "react";
import { format } from "date-fns";

interface FormattedDateProps {
  date: string;
}

const FormattedDate: React.FC<FormattedDateProps> = ({ date }) => {
  const formattedDate = format(new Date(date), "MMMM d, yyyy");
  return <p>{formattedDate}</p>;
};

export default FormattedDate;
