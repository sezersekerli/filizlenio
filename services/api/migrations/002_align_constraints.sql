-- Şema ile shared sabitlerini hizala (idempotent)

alter table public.parcel_events drop constraint if exists parcel_events_type_check;
alter table public.parcel_events add constraint parcel_events_type_check check (
  type in (
    'note', 'irrigation_manual', 'planting', 'harvest',
    'fertilization', 'spray', 'expense_note', 'inspection'
  )
);

alter table public.entitlements drop constraint if exists entitlements_feature_check;
alter table public.entitlements add constraint entitlements_feature_check check (
  feature in (
    'sense_live', 'cloud_recommendations', 'control_commands', 'field_notifications'
  )
);
