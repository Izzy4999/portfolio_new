"use client";

import type { JSX } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSendContact } from "@/app/hooks/use-send-contact";
import { contactSchema } from "@/schemas/contact";
import type { ContactPayload } from "@/types/contact";

const LABEL_CLASS = "caps mb-3 block text-indigo";
const ERROR_CLASS = "mt-2 text-sm text-madder";

export const ContactForm = (): JSX.Element => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ContactPayload>({ resolver: zodResolver(contactSchema) });
	const { mutate: sendContact, isPending } = useSendContact();

	const onValid = (payload: ContactPayload): void => {
		sendContact(payload, { onSuccess: () => reset() });
	};

	return (
		<form onSubmit={handleSubmit(onValid)} noValidate className="grid gap-6 sm:grid-cols-2">
			<div>
				<label htmlFor="contact-name" className={LABEL_CLASS}>
					Name
				</label>
				<input id="contact-name" autoComplete="name" className="field" aria-invalid={Boolean(errors.name)} {...register("name")} />
				{errors.name ? <p className={ERROR_CLASS}>{errors.name.message}</p> : null}
			</div>
			<div>
				<label htmlFor="contact-email" className={LABEL_CLASS}>
					Email
				</label>
				<input id="contact-email" type="email" autoComplete="email" className="field" aria-invalid={Boolean(errors.email)} {...register("email")} />
				{errors.email ? <p className={ERROR_CLASS}>{errors.email.message}</p> : null}
			</div>
			<div className="sm:col-span-2">
				<label htmlFor="contact-phone" className={LABEL_CLASS}>
					Phone or WhatsApp (optional)
				</label>
				<input id="contact-phone" type="tel" autoComplete="tel" className="field" {...register("phone")} />
			</div>
			<div className="sm:col-span-2">
				<label htmlFor="contact-message" className={LABEL_CLASS}>
					What do you need built?
				</label>
				<textarea
					id="contact-message"
					rows={6}
					className="field h-auto py-3 leading-relaxed"
					aria-invalid={Boolean(errors.message)}
					{...register("message")}
				/>
				{errors.message ? <p className={ERROR_CLASS}>{errors.message.message}</p> : null}
			</div>
			<div className="sm:col-span-2">
				<button type="submit" disabled={isPending} className="btn btn-primary w-full sm:w-auto">
					{isPending ? "Sending" : "Send message"}
				</button>
			</div>
		</form>
	);
};
