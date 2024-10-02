import React, { useState } from "react";
import axios from "axios";
import Input from "../Shared/Components/FormElements/input";
import Dropdown from "../Shared/Components/FormElements/Dropdown";
import Button from "../Shared/Components/FormElements/Button.jsx";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MIN,
} from "../Shared/Components/util/validate";
import { useForm } from "../Shared/hooks/form-hook";
import { useNavigate } from "react-router-dom";
import Loader from "../Shared/Components/UiElements/Loader";
//import Toast from "../Shared/Components/UiElements/Toast/Toast";

const categories = [
  { value: "Food" },
  { value: "Clothes" },
  { value: "Shelter" },
  { value: "Medical" },
  { value: "Other" },
];

const DonationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      amountRequired: {
        value: "",
        isValid: false,
      },
      category: {
        value: "",
        isValid: false,
      },
      organization: {
        value: "",
        isValid: false,
      },
      bankDetails: {
        accountNumber: {
          value: "",
          isValid: false,
        },
        bankName: {
          value: "",
          isValid: false,
        },
        accountHolderName: {
          value: "",
          isValid: false,
        },
      },
    },
    false
  );

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    const donationData = {
      title: formState.inputs.title.value,
      description: formState.inputs.description.value,
      amountRequired: formState.inputs.amountRequired.value,
      category: formState.inputs.category.value,
      organization: formState.inputs.organization.value,
      bankDetails: {
        accountNumber: formState.inputs.bankDetails.accountNumber.value,
        bankName: formState.inputs.bankDetails.bankName.value,
        accountHolderName: formState.inputs.bankDetails.accountHolderName.value,
      },
    };

    try {
      await axios.post("http://localhost:5000/donations/new", donationData);
      Toast("Donation added successfully! 🔥", "success");
      navigate("/donations");
    } catch (err) {
      console.error(err);
      Toast("Error adding donation.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submitHandler}>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-full px-6 py-10 bg-gray-100 flex items-center justify-center">
          <div className="container mx-auto">
            <h2 className="font-semibold text-xl text-gray-600 text-center">
              Add Donation
            </h2>
            <p className="text-gray-500 mb-6 text-center">
              Enter donation details below!
            </p>
            <div className="bg-white rounded shadow-lg p-4 md:p-8 mb-6">
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-2">
                <Input
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  element="Input"
                  id="title"
                  type="text"
                  placeholder="Enter donation title"
                  label="Title:"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a title."
                  onInput={inputHandler}
                />
                <Input
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  element="Input"
                  id="description"
                  type="text"
                  placeholder="Enter donation description"
                  label="Description:"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a description."
                  onInput={inputHandler}
                />
                <Input
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  element="Input"
                  id="amountRequired"
                  type="number"
                  placeholder="Enter amount required"
                  label="Amount Required:"
                  validators={[VALIDATOR_MIN(1)]}
                  errorText="Please enter a valid amount."
                  onInput={inputHandler}
                />
                <Dropdown
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  id="category"
                  options={categories}
                  onInput={inputHandler}
                  label="Category:"
                />
                <Input
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  element="Input"
                  id="organization"
                  type="text"
                  placeholder="Enter organization name"
                  label="Organization Name:"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter an organization name."
                  onInput={inputHandler}
                />
                <h3 className="font-semibold text-lg mt-4">Bank Details:</h3>
                <Input
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  element="Input"
                  id="bankDetails.accountNumber"
                  type="text"
                  placeholder="Bank Account Number"
                  label="Account Number:"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter the account number."
                  onInput={inputHandler}
                />
                <Input
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  element="Input"
                  id="bankDetails.bankName"
                  type="text"
                  placeholder="Bank Name"
                  label="Bank Name:"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter the bank name."
                  onInput={inputHandler}
                />
                <Input
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  element="Input"
                  id="bankDetails.accountHolderName"
                  type="text"
                  placeholder="Account Holder Name"
                  label="Account Holder Name:"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter the account holder name."
                  onInput={inputHandler}
                />
                <div className="md:col-span-2 text-right">
                  <Button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    type="submit"
                    disabled={!formState.isValid}
                  >
                    Submit Donation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default DonationForm;
