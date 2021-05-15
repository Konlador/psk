import moment from "moment";

/**
 * Function returning the build date(as per provided epoch)
 * @param epoch Time in milliseconds
 */
export const getBuildDate = (epoch) => {
    const buildDate = moment(epoch).format("YYYY-MM-DD HH:MM");
    return buildDate;
};