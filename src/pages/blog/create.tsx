import type { GetServerSideProps } from 'next'
import {
  adminOnly,
  allowedRoles,
  getAuthCredentials,
  hasAccess,
  isAuthenticated,
} from '@/utils/auth-utils'
import { Routes } from '@/config/routes'

import CreateOrUpdateNoteForm from '@/components/blog/note-form'
import Layout from '@/components/layout/admin'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import DontView from '@/components/dontView/dont-view'

export default function CreateNotePage() {
  const { permissions } = getAuthCredentials()
  let permission = hasAccess(adminOnly, permissions)

  return (
    <>
      {permission ? (
        <>
          <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
            <h1 className="text-lg font-semibold text-heading">
              Crea una nota
            </h1>
          </div>
          <CreateOrUpdateNoteForm />
        </>
      ) : (
        <DontView />
      )}
    </>
  )
}

CreateNotePage.Layout = Layout

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token, permissions } = getAuthCredentials(ctx)
  const locale = ctx.locale || 'es'
  if (
    !isAuthenticated({ token, permissions }) ||
    !hasAccess(allowedRoles, permissions)
  ) {
    return {
      redirect: {
        destination: Routes.login,
        permanent: false,
      },
    }
  }
  return {
    props: {
      userPermissions: permissions,
      ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
    },
  }
}
