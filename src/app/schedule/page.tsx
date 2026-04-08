import { format } from "date-fns";

import {
  createAppointmentAction,
  updateAppointmentStatusAction,
} from "@/app/actions/crm";
import { Surface } from "@/components/crm-cards";
import { CrmShell } from "@/components/crm-shell";
import {
  listAppointments,
  listContacts,
  listOpportunities,
  listRemindersForAppointment,
} from "@/lib/crm";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const appointments = await listAppointments();
  const contacts = await listContacts();
  const opportunities = await listOpportunities();
  const appointmentsWithReminders = await Promise.all(
    appointments.map(async (appointment) => ({
      appointment,
      reminders: await listRemindersForAppointment(appointment.id),
    })),
  );

  return (
    <CrmShell
      title="Schedule"
      subtitle="Book tours and consults, track appointment status, and monitor the reminder sequence attached to each booking."
    >
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Surface>
          <h2 className="text-xl font-semibold text-white">Book an appointment</h2>
          <form action={createAppointmentAction} className="mt-5 space-y-4">
            <select name="contactId" className="crm-input">
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.firstName} {contact.lastName}
                </option>
              ))}
            </select>
            <select name="opportunityId" className="crm-input">
              <option value="">No linked opportunity</option>
              {opportunities.map((opportunity) => (
                <option key={opportunity.id} value={opportunity.id}>
                  {opportunity.contactName} · {opportunity.stageName}
                </option>
              ))}
            </select>
            <input name="title" placeholder="Appointment title" className="crm-input" />
            <input name="ownerName" placeholder="Owner" className="crm-input" />
            <input name="locationName" placeholder="Location" className="crm-input" />
            <input
              name="appointmentType"
              placeholder="Appointment type"
              className="crm-input"
            />
            <input name="startsAt" type="datetime-local" className="crm-input" />
            <button type="submit" className="crm-button">
              Book appointment
            </button>
          </form>
        </Surface>

        <Surface>
          <h2 className="text-xl font-semibold text-white">Upcoming bookings</h2>
          <div className="mt-5 space-y-4">
            {appointmentsWithReminders.map(({ appointment, reminders }) => (
                <div
                  key={appointment.id}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-white">
                        {appointment.contactName}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {appointment.title} · {appointment.appointmentType}
                      </p>
                    </div>
                    <form
                      action={updateAppointmentStatusAction}
                      className="flex items-center gap-3"
                    >
                      <input type="hidden" name="id" value={appointment.id} />
                      <select
                        name="status"
                        defaultValue={appointment.status}
                        className="crm-input min-w-40"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="No Show">No Show</option>
                        <option value="Canceled">Canceled</option>
                      </select>
                      <button type="submit" className="crm-button">
                        Save
                      </button>
                    </form>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">
                    {format(new Date(appointment.startsAt), "EEE, MMM d · h:mm a")} ·{" "}
                    {appointment.locationName} · {appointment.ownerName}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {reminders.map((reminder) => (
                      <span
                        key={reminder.id}
                        className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100"
                      >
                        {reminder.channel} ·{" "}
                        {reminder.offsetMinutes < 0
                          ? `${Math.abs(reminder.offsetMinutes)} min before`
                          : `${reminder.offsetMinutes} min after`}{" "}
                        · {reminder.status}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </Surface>
      </div>
    </CrmShell>
  );
}
