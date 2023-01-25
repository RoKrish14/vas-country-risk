import {
  render,
  act,
  fireEvent,
  waitFor,
  screen,
} from "@testing-library/react";
import { test } from "@jest/globals";
import "@testing-library/jest-dom/extend-expect";
import Ratings from "../../../components/dashboard/Ratings/Ratings";
import { RatesProvider } from "../../../contexts/rates";
import { ReportProvider } from "../../../contexts/reports";
import { getRatingsByYear } from "../../../components/services/ratingstable-api";
import { CompanyUserProvider } from "../../../contexts/companyuser";
import { deleteRating } from "../../../components/services/ratingstable-api";
import { ReloadProvider } from "../../../contexts/refresh";

const ratingsData = [
  {
    id: 1,
    dataSourceName: "CPI Rating 2021",
    type: "Global",
    yearPublished: 2021,
    fileName: null,
    companyUser: null,
  },
];

const passValuesFromComponent = (rates) => {
  return ratingsData;
};

const passAutomaticWeightChange = (weight) => {
  return 1;
};

const response = {
  status: 204,
  name: "AxiosError",
  data: {
    status: 401,
  },
};

jest.mock("../../../components/services/ratingstable-api", () => ({
  getRatingsByYear: jest.fn().mockReturnValue(ratingsData),
  deleteRating: jest.fn().mockReturnValue(response),
}));

test("Renders Ratings", async () => {
  getRatingsByYear.mockImplementation(() => Promise.resolve(ratingsData));

  await act(async () => {
    render(
      <CompanyUserProvider>
        <ReportProvider>
          <RatesProvider>
            <Ratings
              passValuesFromComponent={passValuesFromComponent}
              passAutomaticWeightChange={passAutomaticWeightChange}
              years={2021}
            ></Ratings>
          </RatesProvider>
        </ReportProvider>
      </CompanyUserProvider>
    );
  });

  //Select all Ratings
  const ratingsTable = screen.getByLabelText("Select all rows");
  await act(async () => {
    fireEvent.click(ratingsTable);
  });
  expect(ratingsTable).toBeInTheDocument();

  //Open Dialog
  await waitFor(() => {
    const btndialog = screen.getByText("Show More Ratings");
    expect(btndialog).toBeInTheDocument();
    fireEvent.click(btndialog);
  });

  //Close Dialog
  const closebtn = screen.getByText("Close");
  await act(async () => {
    fireEvent.click(closebtn);
  });
  expect(closebtn).toBeInTheDocument();
});

test("Renders Delete and close alert", async () => {
  getRatingsByYear.mockImplementation(() => Promise.resolve(ratingsData));

  await act(async () => {
    render(
      <CompanyUserProvider>
        <ReportProvider>
          <RatesProvider>
            <Ratings
              passValuesFromComponent={passValuesFromComponent}
              passAutomaticWeightChange={passAutomaticWeightChange}
              years={2021}
            ></Ratings>
          </RatesProvider>
        </ReportProvider>
      </CompanyUserProvider>
    );
  });

  //Select all Ratings
  const ratingsTable = screen.getByLabelText("Select all rows");
  await act(async () => {
    fireEvent.click(ratingsTable);
  });
  expect(ratingsTable).toBeInTheDocument();

  const deleteItem = screen.getByTestId("deleteRatingIcon");
  await act(async () => {
    fireEvent.click(deleteItem);
  });

  const closeBtn = screen.getByTestId("btnNoRating");
  await act(async () => {
    fireEvent.click(closeBtn);
  });
});

test("Renders Delete and Deletes Rating", async () => {
  getRatingsByYear.mockImplementation(() => Promise.resolve(ratingsData));
  deleteRating.mockImplementation(() => Promise.resolve(response));

  await act(async () => {
    render(
      <ReloadProvider>
        <CompanyUserProvider>
          <ReportProvider>
            <RatesProvider>
              <Ratings
                passValuesFromComponent={passValuesFromComponent}
                passAutomaticWeightChange={passAutomaticWeightChange}
                years={2021}
              ></Ratings>
            </RatesProvider>
          </ReportProvider>
        </CompanyUserProvider>
      </ReloadProvider>
    );
  });

  const deleteItem = screen.getByTestId("deleteRatingIcon");
  await act(async () => {
    fireEvent.click(deleteItem);
  });

  const clickYes = screen.getByTestId("btnYesRating");
  await act(async () => {
    fireEvent.click(clickYes);
  });
});
