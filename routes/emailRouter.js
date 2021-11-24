const cors = require("cors"),
    Emails = require("../mongoose/inquirelSchema");

module.exports = function (app, mongooseDB) {
    let Email = mongooseDB.model("Email", Emails.emailSchema);
    let reply = mongooseDB.model("reply", Emails.replyEmailSchema);
    app.get(`/email`, async function (req, res) {
        res.json("welcome to email");
    });


    app.get('/email/:id', cors(), async function (req, res) {
        res.json(req.params.id);
    });


    app.post('/email', cors(), async function (req, res) {

        let userId;
        let email = new Email({
            inquireEmail: req.body.email,
            inquireName: req.body.name,
            inquireTitle: req.body.title,
            inquireMessage: req.body.message,
        });
        try {
            await email.validate();
            userId = await email.save();
        } catch (err) {
            res.status(400).send(err.message);
            res.end;
        }


        res.status(200).json(userId);
    });

    app.post('/email/reply', cors(), async function (req, res) {

        let replyEmail = new reply({
            replyTo: req.body.id,
            Message: req.body.message,
        });
        try {
            await replyEmail.validate();
            const email = await Email.findByIdAndUpdate(req.body.id,
                {
                    "$push": {"replies": replyEmail},
                    "$set": {"emailViewed": true}
                },
                {"new": true, "upsert": true},
            )
            if (email) {

                res.json(email);
            } else
                res.status(400).json("not");
        } catch (err) {
            res.status(400).send(err.message);
            res.end;
        }

    });


    app.delete('/email/:id', cors(), async function (req, res) {
        itemStore.splice(req.params.id, 1)
        res.json(req.body);
    });
}