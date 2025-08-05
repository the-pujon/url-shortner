import { Router } from 'express';
import urlShortenerRoute from '../modules/urlShortener/urlShortener.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/url-shortener',
    route: urlShortenerRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
