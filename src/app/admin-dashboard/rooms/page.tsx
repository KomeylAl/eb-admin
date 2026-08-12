"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import {
  useDeleteRoom,
  useRoomAvailability,
  useRooms,
  useStoreRoom,
  useUpdateRoom,
} from "@/hooks/useRooms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PuffLoader } from "react-spinners";
import CustomDatePicker from "@/components/ui/custom/DatePicker";
import { convertBaseDate, dateConvert } from "@/lib/utils";
import { DateObject } from "react-multi-date-picker";
import WithRole from "../_components/WithRole";

const RoomsPage = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const { data, isLoading, refetch } = useRooms(true, false);
  const { data: availability, isLoading: availabilityLoading } =
    useRoomAvailability(date);
  const { mutate: storeRoom, isPending } = useStoreRoom(() => {
    setName("");
    setCode("");
    refetch();
  });
  const { mutate: updateRoom } = useUpdateRoom(() => refetch());
  const { mutate: deleteRoom } = useDeleteRoom(() => refetch());

  const rooms = data?.data ?? [];

  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={() => {}} isShowSearch={false} />
      <WithRole allowedRoles={["boss", "manager", "receptionist"]}>
        <div className="p-6 md:p-12 space-y-8">
          <h2 className="font-bold text-2xl">اتاق‌های کلینیک</h2>

          <div className="rounded-xl border bg-white p-4 dark:bg-gray-800 space-y-3 max-w-xl">
            <h3 className="font-semibold">افزودن اتاق</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>نام</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label>کد</Label>
                <Input value={code} onChange={(e) => setCode(e.target.value)} />
              </div>
            </div>
            <Button
              disabled={isPending || !name}
              onClick={() =>
                storeRoom({
                  name,
                  code: code || null,
                  is_active: true,
                })
              }
            >
              ذخیره اتاق
            </Button>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">فهرست اتاق‌ها</h3>
            {isLoading && <PuffLoader color="#3e86fa" size={40} />}
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {rooms.map((room: any) => (
                <div key={room.id} className="rounded-lg border p-4 space-y-2">
                  <p className="font-medium">
                    {room.name}{" "}
                    {room.code ? (
                      <span className="text-muted-foreground">({room.code})</span>
                    ) : null}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {room.is_active ? "فعال" : "غیرفعال"}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateRoom({
                          id: room.id,
                          body: { is_active: !room.is_active },
                        })
                      }
                    >
                      {room.is_active ? "غیرفعال" : "فعال"} کردن
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteRoom(room.id)}
                    >
                      حذف
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h3 className="font-semibold">اشغال اتاق‌ها در روز</h3>
              <div className="w-56">
                <Label>تاریخ</Label>
                <CustomDatePicker
                  value={dateConvert(date)}
                  onChange={(d: DateObject | null) => {
                    if (d) setDate(convertBaseDate(d));
                  }}
                />
              </div>
            </div>
            {availabilityLoading && <PuffLoader color="#3e86fa" size={40} />}
            <div className="space-y-3">
              {(availability?.data?.rooms ?? []).map((item: any) => (
                <div key={item.room.id} className="rounded-lg border p-4">
                  <p className="font-medium mb-2">{item.room.name}</p>
                  {item.occupied_slots.length === 0 ? (
                    <p className="text-sm text-emerald-600">آزاد</p>
                  ) : (
                    <ul className="text-sm space-y-1">
                      {item.occupied_slots.map((slot: any) => (
                        <li key={slot.appointment_id}>
                          {slot.time} — {slot.client?.name || "مراجع"} /{" "}
                          {slot.doctor?.name || "درمانگر"}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </WithRole>
    </div>
  );
};

export default RoomsPage;
