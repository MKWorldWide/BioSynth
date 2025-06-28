import { generateClient } from 'aws-amplify/api';
import { createContact } from '../graphql/mutations';

export interface ContactFormData {
  name: string;
  email: string;
  org?: string;
  message: string;
}

const client = generateClient();

export async function submitContact(data: ContactFormData) {
  const input = {
    name: data.name,
    email: data.email,
    org: data.org,
    message: data.message,
    timestamp: new Date().toISOString(),
  };
  try {
    const result = await client.graphql({ query: createContact, variables: { input } });
    return { success: true, result };
  } catch (error) {
    return { success: false, error };
  }
} 