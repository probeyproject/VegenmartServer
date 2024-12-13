import db from "../db/db.js";

export const createBannerModel = async (bannerName, bannerOffer, bannerOfferTitle, bannerImg, bannerTitle, bannerTitleSmall, bannerDesc, status) => {
    try {
        const query = 'INSERT INTO banners (banner_name, banner_offer, banner_offer_title, banner_image, banner_title, banner_title_small, banner_desc, status) VALUES (?,?,?,?,?,?,?,?)';
        const [result] = await db.query(query, [bannerName, bannerOffer, bannerOfferTitle, bannerImg, bannerTitle, bannerTitleSmall, bannerDesc, status]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log('Banner Model Error', error);
        throw new Error(`createcareInstructionModel DB error ${error.message}`)
    }
};


export const getAllBannerModel = async () => {
    try {
        const query = 'SELECT * FROM banners';
        const [result] = await db.query(query);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log('Banner Model Error', error);
        throw new Error(`createcareInstructionModel DB error ${error.message}`)
    }
}

export const getBannerByIdModel = async (bannerId) => {
    try {
        const query = 'SELECT * FROM banners WHERE banner_id = ?';
        const [result] = await db.query(query,[bannerId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log('Banner Model Error', error);
        throw new Error(`createcareInstructionModel DB error ${error.message}`)
    }
}

// For Edit
export const getBannerForEditByIdModel = async (bannerId) => {
    try {
        const query = 'SELECT * FROM banners WHERE banner_id = ?';
        const [result] = await db.query(query, [bannerId]);
        return result[0];
    } catch (error) {
        console.log('Banner Model Error', error); 
        throw new Error(`createcareInstructionModel DB error ${error.message}`)
    }
}


export const editBannerByIdModel = async (bannerName, bannerOffer, bannerOfferTitle, bannerImage, bannerTitle, bannerTitleSmall, bannerDesc, status, bannerId) => {
    try {
        const query = 'UPDATE banners SET banner_name = ?, banner_offer = ?, banner_offer_title = ?, banner_image = ?, banner_title = ?, banner_title_small = ?, banner_desc = ?, status = ? WHERE banner_id = ?';
        const [result] = await db.query(query, [bannerName, bannerOffer, bannerOfferTitle, bannerImage, bannerTitle, bannerTitleSmall, bannerDesc, status, bannerId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log('Banner Model Error', error);
        throw new Error(`createcareInstructionModel DB error ${error.message}`)
    }
};


export const deleteBannerByIdModel = async (bannerId) => {
    try {
        const query = 'DELETE FROM banners WHERE banner_id = ?';
        const [result] = await db.query(query,[bannerId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log('Banner Model Error', error);
        throw new Error(`createcareInstructionModel DB error ${error.message}`)
    }
}