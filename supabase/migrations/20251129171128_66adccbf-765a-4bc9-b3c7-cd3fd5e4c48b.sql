-- Create notifications table for real-time alerts
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  submission_id UUID REFERENCES public.patient_submissions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('high_risk', 'moderate_risk', 'info')),
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Admins can view all notifications
CREATE POLICY "Admins can view all notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
ON public.notifications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- System can insert notifications
CREATE POLICY "System can insert notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Add email_notifications preference to profiles
ALTER TABLE public.profiles
ADD COLUMN email_notifications BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN notification_preferences JSONB DEFAULT '{"high_risk": true, "moderate_risk": true, "reminders": true}'::jsonb;

-- Create function to notify admins of high-risk assessments
CREATE OR REPLACE FUNCTION public.notify_high_risk_assessment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only create notifications for high or moderate risk
  IF NEW.risk_level IN ('High', 'Moderate') THEN
    -- Insert notification for all admin users
    INSERT INTO public.notifications (user_id, submission_id, title, message, type)
    SELECT 
      ur.user_id,
      NEW.id,
      CASE 
        WHEN NEW.risk_level = 'High' THEN 'High Risk Assessment Alert'
        ELSE 'Moderate Risk Assessment Alert'
      END,
      'Patient ' || NEW.patient_name || ' has been assessed with ' || NEW.risk_level || ' risk level. Mortality risk: ' || ROUND(NEW.mortality_risk::numeric, 2) || '%',
      CASE 
        WHEN NEW.risk_level = 'High' THEN 'high_risk'
        ELSE 'moderate_risk'
      END
    FROM public.user_roles ur
    WHERE ur.role = 'admin';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for high-risk notifications
CREATE TRIGGER on_high_risk_assessment
  AFTER INSERT ON public.patient_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_high_risk_assessment();

-- Enable Realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Set replica identity for real-time updates
ALTER TABLE public.notifications REPLICA IDENTITY FULL;