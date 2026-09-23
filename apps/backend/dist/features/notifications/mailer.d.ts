export type MailInput = {
    to: string;
    subject: string;
    html: string;
};
export declare function sendMail(input: MailInput): Promise<void>;
//# sourceMappingURL=mailer.d.ts.map