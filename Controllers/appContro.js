
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const URL = require("node:url")
const https = require("https");
const { Link, User } = require("../Models/appSchema");
const Configuration = require("puppeteer")
const fileUploads = async (req, res) => {

    const { link, id } = req.body;

    const url = URL.parse(link)

    const directory = path.resolve("./Files")

    //console.log(url);

    const browser = await puppeteer.launch({
        headless: false,
    });

    const page = await browser.newPage();

    await page.goto(link, { waitUntil: 'networkidle2' });

    //goFile
    if (url.host == 'gofile.io') {

        console.log("Enter into gofile.io");


        const findLink = await Link.find({
            $and: [
                {
                    link: link
                },
                {
                    user_id: id
                }
            ]
        })

        console.log(findLink.length);

        if (findLink.length != 0) {
            res.send({
                success: false,
                message: "Link is already downloaded"
            })
            return
        }


        await page.waitForSelector('#contentId-download');
        await page.click('#contentId-download')


        const client = await page.target().createCDPSession()
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: directory,
        })


        const saveLink = new Link({
            link: link,
            user_id: id
        })
        saveLink.save().then(response => {
            res.send({
                success: true,
                message: "File is downloading ",
                response: response
            })
        }).catch(err => {
            res.send({
                message: "Error in file downlopaded"
            })
        })

        //browser.close()
    }

    //pixeldrain
    else if (url.hostname == "pixeldrain.com") {

        console.log('Enter into pixelDrain');


        const findLink = await Link.find({
            $and: [
                {
                    link: link
                },
                {
                    user_id: id
                }
            ]
        })

        if (findLink) {
            res.send({
                success: false,
                message: "Link is already downloaded"
            })
            return
        }

        await page.waitForSelector('#toolbar > button:nth-child(3) > span ')
        await page.click('#toolbar > button:nth-child(3)');


        const saveLink = new Link({
            link: link,
            user_id: id
        })
        saveLink.save().then(response => {
            res.send({
                success: true,
                message: "File is downloading ",
                response: response
            })
        }).catch(err => {
            res.send({
                message: "Error in file downlopaded"
            })
        })


        // browser.close();
    }


    else if (url.host == "files.fm") {

        console.log("Enter into files.fm");



        const findLink = await Link.find({
            $and: [
                {
                    link: link
                },
                {
                    user_id: id
                }
            ]
        })

        if (findLink) {
            res.send({
                success: false,
                message: "Link is already downloaded"
            })
            return
        }


        await page.waitForSelector("#head_download__all-files > div.head_download__button");
        await page.click("#head_download__all-files > div.head_download__button")


        await page.waitForSelector("#head_download__all-files > div.head_download__dropdown > div.head_download__dropdown__content > a:nth-child(1)");
        await page.click("#head_download__all-files > div.head_download__dropdown > div.head_download__dropdown__content > a:nth-child(1)")


        const saveLink = new Link({
            link: link,
            user_id: id
        })
        saveLink.save().then(response => {
            res.send({
                success: true,
                message: "File is downloading ",
                response: response
            })
        }).catch(err => {
            res.send({
                message: "Error in file downlopaded"
            })
        })


        // https.get(link, (res) => {
        //     const path = "downloaded-image.jpg";
        //     const writeStream = fs.createWriteStream(path);

        //     res.pipe(writeStream);

        //     writeStream.on("finish", () => {
        //         writeStream.close();
        //         console.log("Download Completed!");
        //     })
        // })
    }

    else if (url.host == "workupload.com") {

        console.log("Enter into workupload.com");




        const findLink = await Link.find({
            $and: [
                {
                    link: link
                },
                {
                    user_id: id
                }
            ]
        })

        if (findLink) {
            res.send({
                success: false,
                message: "Link is already downloaded"
            })
            return
        }

        await page.waitForSelector("#download > div > a");
        await page.click("#download > div > a")


        const saveLink = new Link({
            link: link,
            user_id: id
        })
        saveLink.save().then(response => {
            res.send({
                success: true,
                message: "File is downloading ",
                response: response
            })
        }).catch(err => {
            res.send({
                message: "Error in file downlopaded"
            })
        })



    }

    else if (url.hostname = 'uploadhaven.com') {

        console.log("Enter into uploadhaven.com");

        const findLink = await Link.find({
            $and: [
                {
                    link: link
                },
                {
                    user_id: id
                }
            ]
        })

        if (findLink) {
            res.send({
                success: false,
                message: "Link is already downloaded"
            })
            return
        }


        setTimeout(async () => {
            console.log("Clickable");
            const selector = await page.waitForSelector("#submitFree")

            page.evaluate((btn) => {
                // this executes in the page
                console.log("Button btn");
                btn.click();
            }, selector);
        }, 17000);


        const saveLink = new Link({
            link: link,
            user_id: id
        })
        saveLink.save().then(response => {
            res.send({
                success: true,
                message: "File is downloading ",
                response: response
            })
        }).catch(err => {
            res.send({
                message: "Error in file downlopaded"
            })
        })




    }

    else {
        console.log("Url is not supported");
        res.send({
            message: "link is not supported",
            success: false
        })
    }

}


const userCreate = (req, res) => {

    const { name, password } = req.body;

    if (!name || !password) {
        res.send({
            success: false,
            message: "Please fil all the fields"
        })
        return
    }

    const createAccount = new User({
        Name: name,
        Password: password
    })

    createAccount.save().then(response => {
        res.send({
            success: true,
            message: "User Account is created",
            response: response
        })
    }).catch(err => {
        res.send({
            message: "Error in user creation"
        })
    })
}

const userLogin = (req, res) => {


    try {
        const { name, password } = req.body;

        if (!name || !password) {
            res.send({
                success: false,
                message: "Please fil all the fields"
            })
            return
        }

        User.findOne({ $and: [{ Name: name }, { Password: password }] }, (err, data) => {

            if (err) {
                res.send({
                    success: false,
                    message: "Error in user login api"
                })
                return
            }
            if (data) {
                res.send({
                    success: true,
                    message: "User is login",
                    data: data
                })
                return
            }

            if (data === null) {

                res.send({
                    success: false,
                    message: "user is not valid"
                })
                return
            }
        })
    }
    catch (err) {
        res.send({
            message: "error in try bloack of login api",
            success: false,
            error: err.stack
        })
    }
}

module.exports = {
    fileUploads,
    userCreate,
    userLogin
}