import type { JSX } from "react";
import type { Metadata } from "next";

import { SITE, SOCIALS } from "@/lib/site";

import { ContactForm } from "../components/canopy/ContactForm";
import { SilkCanopy } from "../components/canopy/SilkCanopy";
import { SiteShell } from "../components/canopy/SiteShell";

export const metadata: Metadata = {
	title: "Contact",
	description: "Hire Favour Israel Taiwo or ask about a project.",
};

const DETAIL_LINK_CLASS = "block [overflow-wrap:anywhere] text-lg tracking-wide text-indigo underline-offset-4 hover:underline";

const ContactPage = (): JSX.Element => {
	return (
		<SiteShell>
			<header className="relative overflow-hidden border-b border-indigo/40 px-6 pb-12 pt-40 lg:px-12 lg:pt-48">
				<div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-sky to-cloud" />
				<SilkCanopy className="absolute inset-x-0 top-0 h-64 max-lg:-left-[30%] lg:left-[20%]" />
				<div className="relative z-10">
					<h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-light uppercase leading-[1.1] tracking-[0.16em] text-indigo">
						Say hello
					</h1>
					<p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-indigo">
						Tell me about the role or the product. I reply by email.
					</p>
				</div>
			</header>

			<div className="lg:grid lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
				<section aria-label="Contact form" className="border-b border-indigo/40 p-6 lg:border-b-0 lg:border-r lg:p-12">
					<ContactForm />
				</section>

				<section id="socials" aria-labelledby="socials-heading" className="scroll-mt-8 p-6 lg:p-12">
					<h2 id="socials-heading" className="caps mb-6 border-b border-indigo/40 pb-4 text-indigo">
						Email and socials
					</h2>
					<ul className="grid gap-6">
						<li>
							<span className="caps mb-2 block text-indigo">Email</span>
							<a href={`mailto:${SITE.email}`} className={DETAIL_LINK_CLASS}>
								{SITE.email}
							</a>
						</li>
						{SOCIALS.map((social) => (
							<li key={social.label}>
								<span className="caps mb-2 block text-indigo">{social.label}</span>
								<a href={social.href} target="_blank" rel="noopener noreferrer" className={DETAIL_LINK_CLASS}>
									{social.href.replace("https://", "").replace("www.", "")}
								</a>
							</li>
						))}
					</ul>
				</section>
			</div>
		</SiteShell>
	);
};

export default ContactPage;
