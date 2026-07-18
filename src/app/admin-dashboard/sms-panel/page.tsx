"use client";

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSendMultiSms, useSendSingleSms } from "@/hooks/useSms";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import { Label } from "@/components/ui/label";

const SmsPanel = () => {
  const [singlePhone, setSinglePhone] = useState("");
  const [singleText, setSingleText] = useState("");

  const [multiPhone, setMultiPhone] = useState("");
  const [multiText, setMultiText] = useState("");

  const { mutate: sendSingle, isPending: isSendingSingle } = useSendSingleSms(
    () => {}
  );
  const { mutate: sendMulti, isPending: isSendingMulti } = useSendMultiSms(
    () => {}
  );

  const sendSingleSms = () => {
    if (!singlePhone || !singleText) {
      toast.error("لطفا همه فیلد ها را پر کنید");
    } else {
      sendSingle({ phone: singlePhone, text: singleText });
    }
  };

  const processPhoneNumbers = (textareaValue: string) => {
    return textareaValue
      .split("\n") // جدا کردن بر اساس اینتر
      .map((number) => number.trim()) // حذف فضاهای اضافی
      .filter((number) => number !== ""); // حذف خطوط خالی
  };

  const sendMultiSms = async () => {
    const phones = processPhoneNumbers(multiPhone);
    if (!multiPhone || !multiText) {
      toast.error("لطفا همه فیلد ها را پر کنید");
    } else {
      sendMulti({ phones, text: multiText });
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Header isShowSearch={false} searchFn={() => {}} />
      <div className="flex flex-col lg:flex-row gap-6 p-8">
        <div className="flex flex-col items-start gap-3 w-full lg:w-[40%]">
          <p className="font-semibold">ارسال پیامک تکی</p>
          <div className="w-full flex flex-col space-y-5">
            <Label htmlFor="message">پیام</Label>
            <Textarea
              name="message"
              id=""
              onChange={(e: any) => setSingleText(e.target.value)}
              className="bg-white p-2 rounded-md w-full"
            />
            <Label htmlFor="message">شماره تلفن</Label>
            <Input
              onChange={(e: any) => setSinglePhone(e.target.value)}
              type="number"
              className="bg-white rounded-sm w-full p-2"
              placeholder="شماره تلفن"
            />
            <Button onClick={sendSingleSms} disabled={isSendingSingle}>
              {isSendingSingle ? "در حال ارسال" : "ارسال پیامک"}
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 w-full lg:w-[40%]">
          <p className="font-semibold">ارسال پیامک گروهی</p>
          <div className="w-full flex flex-col space-y-5">
            <Label htmlFor="message">پیام</Label>
            <Textarea
              name="message"
              id=""
              onChange={(e: any) => setMultiText(e.target.value)}
              className="bg-white p-2 rounded-md w-full"
            />
            <Label htmlFor="phone_numbers">
              شمار های تلفن
            </Label>
            <Textarea
              onChange={(e: any) => setMultiPhone(e.target.value)}
              name="phone_numbers"
              rows={10}
              className="bg-white rounded-sm w-full p-2"
              placeholder="شماره ها را با Enter از یکدیگر جدا کنید"
            />
            <Button onClick={() => sendMultiSms()} disabled={isSendingMulti}>
              {isSendingMulti ? "در حال ارسال" : "ارسال پیامک"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmsPanel;
