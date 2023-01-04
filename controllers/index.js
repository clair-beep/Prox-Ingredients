


exports.getProductByCategories = async (req, res, next) => {
    try {
        res.render("product-categories");
    } catch (err) {
        console.log(err)
    }
};

exports.getSearch = async (req, res, next) => {
    try {
        res.render("search");
    } catch (err) {
        console.log(err)
    }
};

exports.getAbout = async (req, res, next) => {
    try {
        res.render("about");
    } catch (err) {
        console.log(err)
    }
};

exports.getTermsOfUse = async (req, res, next) => {
    try {
        res.render("terms-of-use");

    } catch (err) {
        console.log(err)
    }
};