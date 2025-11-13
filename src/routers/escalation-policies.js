import express from 'express';
import { EscalationPoliciesController } from '../controllers/escalation-policies.js';

const router = express.Router();

router.get('/', EscalationPoliciesController.getAllEscalationPolicies);
router.post('/', EscalationPoliciesController.createEscalationPolicy);

export default router;