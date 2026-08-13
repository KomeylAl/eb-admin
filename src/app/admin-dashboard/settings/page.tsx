"use client";

import Header from "@/components/layout/Header";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import {
  useBackupDoctors,
  useBackupDoctorResumes,
  useBackupClients,
  useBackupPosts,
  useBackupCategoties,
  useBackupTags,
  useBackupWorkshops,
  useBackupAbout,
  useBackupAdmins,
} from "@/hooks/useBackup";

import {
  useRestoreDoctors,
  useRestoreDoctorResumes,
  useRestoreClients,
  useRestorePosts,
  useRestoreCategories,
  useRestoreTags,
  useRestoreWorkshops,
  useRestoreAbout,
  useRestoreAdmins,
} from "@/hooks/useRestore";
import BackupRestoreSection from "../_components/BackupRestoreSection";
import ChangePasswordForm from "../_components/forms/ChangePasswordForm";

export default function Settings() {
  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={() => {}} isShowSearch={false} />

      <div className="p-4 sm:p-6 md:p-8 space-y-6">
        <h2 className="font-bold text-2xl">تنظیمات</h2>

        <Accordion type="multiple" className="space-y-4">
          <AccordionItem value="account">
            <AccordionTrigger>حساب کاربری و رمز عبور</AccordionTrigger>
            <AccordionContent>
              <ChangePasswordForm />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="doctors">
            <AccordionTrigger>متخصصین</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <BackupRestoreSection
                title="متخصصین"
                backupHook={useBackupDoctors}
                restoreHook={useRestoreDoctors}
              />
              <BackupRestoreSection
                title="رزومه متخصصین"
                backupHook={useBackupDoctorResumes}
                restoreHook={useRestoreDoctorResumes}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="clients">
            <AccordionTrigger>مراجعان</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <BackupRestoreSection
                title="مراجعان"
                backupHook={useBackupClients}
                restoreHook={useRestoreClients}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="content">
            <AccordionTrigger>محتوا</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <BackupRestoreSection
                title="مقالات"
                backupHook={useBackupPosts}
                restoreHook={useRestorePosts}
              />
              <BackupRestoreSection
                title="دسته‌بندی‌ها"
                backupHook={useBackupCategoties}
                restoreHook={useRestoreCategories}
              />
              <BackupRestoreSection
                title="برچسب‌ها"
                backupHook={useBackupTags}
                restoreHook={useRestoreTags}
              />
              <BackupRestoreSection
                title="کارگاه‌ها"
                backupHook={useBackupWorkshops}
                restoreHook={useRestoreWorkshops}
              />
              <BackupRestoreSection
                title="درباره‌ی مرکز"
                backupHook={useBackupAbout}
                restoreHook={useRestoreAbout}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="admins">
            <AccordionTrigger>مدیران</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <BackupRestoreSection
                title="مدیران"
                backupHook={useBackupAdmins}
                restoreHook={useRestoreAdmins}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
