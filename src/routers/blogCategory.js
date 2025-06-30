const express = require("express");
const router = new express.Router();
const BlogCategory = require("../models/blogCategory");


router.post("/createBlogCategory", async (req, res) => {
    try {
        let body = req.body;
        let data = await BlogCategory({ ...body }).save();
        res.json({ status: true, msg: "Blog Category Created" });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get("/getAllBlogsCategory", async (req, res) => {
    try {
        let data = await BlogCategory.find({});
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get("/getBlogCategoryById/:id", async (req, res) => {
    try {
        let _id = req.params.id;
        let data = await BlogCategory.findById(_id);
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete("/deleteBlogCategory/:id", async (req, res) => {
    try {
        let _id = req.params.id;
        let data = await BlogCategory.findByIdAndDelete(_id);
        res.json({ status: true, msg: "Deleted" });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.patch("/updateBlogCategory/:id", async (req, res) => {
    try {
        let _id = req.params.id;
        let body = req.body;
        let data = await BlogCategory.findByIdAndUpdate(_id, body);
        res.json({ status: true, msg: "Updated" });
    } catch (err) {
        res.status(400).send(err);
    }
});



module.exports = router;