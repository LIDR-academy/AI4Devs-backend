import { CreateCandidateDTO } from '../dtos/CreateCandidateDTO';
import { ValidationError } from '../errors/CustomErrors';

const NAME_REGEX = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^(6|7|9)\d{8}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const validateName = (name: string) => {
    if (!name || name.length < 2 || name.length > 100 || !NAME_REGEX.test(name)) {
        throw new ValidationError('Invalid name');
    }
};

const validateEmail = (email: string) => {
    if (!email || !EMAIL_REGEX.test(email)) {
        throw new ValidationError('Invalid email');
    }
};

const validatePhone = (phone: string) => {
    if (phone && !PHONE_REGEX.test(phone)) {
        throw new ValidationError('Invalid phone');
    }
};

const validateDate = (date: string) => {
    if (!date || !DATE_REGEX.test(date)) {
        throw new ValidationError('Invalid date');
    }
};

export const validateCandidateData = (data: CreateCandidateDTO) => {
    validateName(data.firstName);
    validateName(data.lastName);
    validateEmail(data.email);
    
    if (data.phone) {
        validatePhone(data.phone);
    }

    if (data.educations) {
        for (const education of data.educations) {
            validateName(education.institution);
            validateName(education.title);
            validateDate(education.startDate);
            if (education.endDate) validateDate(education.endDate);
        }
    }

    if (data.workExperiences) {
        for (const experience of data.workExperiences) {
            validateName(experience.company);
            validateName(experience.position);
            validateDate(experience.startDate);
            if (experience.endDate) validateDate(experience.endDate);
        }
    }

    if (data.cv) {
        if (typeof data.cv.filePath !== 'string' || typeof data.cv.fileType !== 'string') {
            throw new ValidationError('Invalid CV data');
        }
    }
}; 