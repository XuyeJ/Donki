
import React from 'react';
import { Task, EmergencyContact } from './types';

export const TASKS: Task[] = [
  // Morning
  { id: 'm-1', category: 'Morning', text: 'Royal Canin Wet Food', subtext: '1 pouch', time: '08:00' },
  { id: 'm-2', category: 'Morning', text: 'Refresh Water', subtext: 'Use filtered water', time: '08:00' },
  { id: 'm-3', category: 'Morning', text: 'Morning Dry Food', subtext: 'Half of the daily bag', time: '08:00' },
  { id: 'm-4', category: 'Morning', text: 'Clean Litter Box', subtext: 'Tie bag and dispose' },
  
  // Afternoon
  { id: 'a-1', category: 'Afternoon', text: 'Leonardo Wet Food', subtext: '1 pouch', time: '18:30-19:00' },
  { id: 'a-2', category: 'Afternoon', text: 'Medication Check', subtext: 'Prednicortone 1/4 (Every 2 days)', time: '18:30-19:00' },
  { id: 'a-3', category: 'Afternoon', text: 'Urine Check', subtext: 'Confirm at least 1 urine today' },
  
  // Night
  { id: 'n-1', category: 'Night', text: 'Night Dry Food', subtext: 'Remaining half of bag', time: 'Before Sleep' },
  { id: 'n-2', category: 'Night', text: 'Final Safety Check', subtext: 'Windows, Balcony, Trash' },

  // Safety/Ongoing
  { id: 's-1', category: 'Safety', text: 'No Scents/Essential Oils', subtext: 'Keep air clear' },
  { id: 's-2', category: 'Safety', text: 'No Toxic Plants', subtext: 'Check Lily, Tulip, Aloe etc.' },
  { id: 's-3', category: 'Safety', text: 'Clear Tables', subtext: 'No human food left out' }
];

export const HOSPITAL: EmergencyContact = {
  name: 'AniCura Copenhagen Animal Hospital',
  phone: '36 17 57 11',
  description: 'Provide owner phone: 71 80 81 21 for records'
};

export const OWNER_SECONDARY: EmergencyContact = {
  name: 'Yang Fan',
  phone: '50 14 33 41',
  description: 'Secondary contact if owner is unreachable for major costs'
};

export const MEDICATION_START_DATE = new Date('2025-12-19');

export const TOXIC_FOODS = [
  'Onion, Garlic, Leeks',
  'Grapes & Raisins',
  'Chocolate',
  'Alcohol / Raw Dough',
  'Xylitol',
  'Tea / Coffee'
];

export const TOXIC_PLANTS = [
  'Lily (High Risk)',
  'Tulip',
  'Hyacinth',
  'Oleander',
  'Aloe',
  'Evergreen',
  'Pothos',
  'Poinsettia'
];
