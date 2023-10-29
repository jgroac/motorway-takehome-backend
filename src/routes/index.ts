import express from 'express';

const router = express.Router();

router.get('/vehicles/:id', (req, res) => {
  return res.status(200).send({
    data: 'hello world',
  });
});

export default router;
