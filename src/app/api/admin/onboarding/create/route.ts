import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, contactName, contactEmail, logoBase64, logoFileName } = body;

    if (!clientName) {
      return NextResponse.json(
        { error: 'Client name is required' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // Generate IDs and token
    const agencyId = uuidv4();
    const clientId = uuidv4();
    const sessionId = uuidv4();
    const token = crypto.randomBytes(32).toString('hex');

    // Create agency account (use a placeholder for admin-created sessions)
    const { error: agencyError } = await supabase
      .from('agency_accounts')
      .insert({
        id: agencyId,
        agency_name: 'Admin Agency',
      });

    if (agencyError && !agencyError.message.includes('duplicate')) {
      console.error('Agency creation error:', agencyError);
    }

    // Create client
    const { error: clientError } = await supabase
      .from('clients')
      .insert({
        id: clientId,
        agency_id: agencyId,
        client_name: clientName,
        primary_contact_name: contactName || null,
        primary_contact_email: contactEmail || null,
      });

    if (clientError) {
      console.error('Client creation error:', clientError);
      return NextResponse.json(
        { error: 'Failed to create client: ' + clientError.message },
        { status: 500 }
      );
    }

    // Upload logo if provided
    let logoPath = null;
    if (logoBase64 && logoFileName) {
      const fileExt = logoFileName.split('.').pop();
      logoPath = `${agencyId}/${sessionId}/logo.${fileExt}`;

      // Convert base64 to buffer
      const base64Data = logoBase64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      const { error: uploadError } = await supabase.storage
        .from('onboarding-logos')
        .upload(logoPath, buffer, {
          contentType: `image/${fileExt}`,
        });

      if (uploadError) {
        console.error('Logo upload error:', uploadError);
        logoPath = null;
      }
    }

    // Create onboarding session
    const { error: sessionError } = await supabase
      .from('onboarding_sessions')
      .insert({
        id: sessionId,
        agency_id: agencyId,
        client_id: clientId,
        token,
        status: 'draft',
        current_step: 0,
        logo_path: logoPath,
      });

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      return NextResponse.json(
        { error: 'Failed to create session: ' + sessionError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      token,
      sessionId,
    });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
