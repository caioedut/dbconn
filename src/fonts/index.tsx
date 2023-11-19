import { Roboto, Roboto_Mono } from 'next/font/google';

const RobotoFont = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
});

const RobotoMonoFont = Roboto_Mono({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
});

export { RobotoFont, RobotoMonoFont };
