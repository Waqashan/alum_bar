import axios from "../BaseUrl";
export const getInvoiceDetials = async () => {
    try {
        const response = await axios.get("/invoice")
        return response;
    } catch (err) {
        return err.response
    }
}
