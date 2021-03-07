  const express = require('express');
  const router = express.Router()
      //var db = require('../../model/mongodb.js');
  var Wallet = require('../../model/mongodb')
  var CONFIG = require('../../config/config');
  var objectID = require('mongodb').ObjectID
  var stripe = require('stripe')('');
  var paypal = require('paypal-rest-sdk');

  router.post('/mobile/mobile/wallet-recharge/mpesa-pay', (req, res) => {
      try {
          console.log("saved ")
          user_id = req.body.user_id,
              total_amount = req.body.total_amount;

          errors = req.validationErrors();
          var errors = req.validationErrors();
          if (errors) {
              data.response = errors[0].msg;

              res.send(data);

          }
          req.sanitizeBody('user_id').trim();
          req.sanitizeBody('total_amount').trim();
          req.checkBody('user_id', res.__(CONFIG.USER + ' ID is Required ** 230')).notEmpty();
          Wallet.walletReacharge.find({ user_id }).then(user_id => {
              console.log("user_id", user_id)
              if (!user_id) {
                  return res.status(401).json({ message: 'User with that Id does not exist' })
              } else {
                  return res.status(500).json({ message: "ok" }).json(200)

              }
          })
          const wallet = new Wallet.walletReacharge({
              user_id: user_id,
              total_amount: total_amount
          })
          return wallet.save()


      } catch (err) {
          res.json({ message: "Error  message" })
      }



  });
  module.exports = router;