"use client"

import Link from "next/link"

import { zodResolver } from "@hookform/resolvers/zod"
import { Github } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { Button, Input, Label, Typography } from "ui"
import { z } from "zod"

import { signInWithCredentials, signInWithGithub } from "@/actions/auth"

import AuthForm from "../auth-form"

type FormData = {
  email: string
  password: string
}

export default function SignIn() {
  const t = useTranslations("auth")

  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
      })
    ),
  })

  console.log("formState", formState)

  const onSignIn = async (data: FormData) => {
    await signInWithCredentials(data.email, data.password)
  }

  return (
    <div className="w-full max-w-md flex-1 p-8">
      <AuthForm
        title={t("sign_in.title")}
        description={t("sign_in.description")}
      >
        <div className="w-full">
          <form onSubmit={handleSubmit(onSignIn)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  {...register("email", { required: true })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="********"
                  type="password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  {...register("password", { required: true })}
                />
              </div>
              <Button type="submit">{t("sign_in.title")}</Button>
            </div>
          </form>
          <div className="flex w-full flex-col">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center py-4 text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t("or_continue_with")}
                </span>
              </div>
            </div>

            <form action={signInWithGithub}>
              <Button
                variant="outline"
                type="submit"
                className="w-full"
              >
                <Github size={16} />
                <span className="ml-2">{t("github")}</span>
              </Button>
            </form>
          </div>
        </div>
      </AuthForm>
      <div className="mt-4 text-center">
        <Link href="/signup">
          <Typography
            variant="span"
            className="mt-4"
          >
            {t("dont_have_an_account")}
            <Typography
              className="pl-1 font-bold hover:underline"
              variant="span"
            >
              {t("sign_up.title")}
            </Typography>
          </Typography>
        </Link>
      </div>
    </div>
  )
}
