import React from 'react';
import { User, Building, Mail } from 'lucide-react';
import { getLecturerSlug } from '../../utils/slugUtils';
import TrackedEntityCard, { TrackedCardStars } from '../common/TrackedEntityCard';

const TrackedLecturerCard = ({ lecturer, onRemove }) => {
    return (
        <TrackedEntityCard
            to={`/lecturer/${getLecturerSlug(lecturer)}`}
            accent="lecturer"
            icon={User}
            title={lecturer.name}
            removeLabel="הסר מרשימה"
            onRemove={() => onRemove(lecturer._id)}
            footerNote={lecturer.academicInstitution || 'מכללת אפקה'}
            meta={
                <>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                        <Building className="w-4 h-4" aria-hidden="true" />
                        <span className="truncate">{lecturer.department}</span>
                    </div>
                    {lecturer.email && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="w-4 h-4" aria-hidden="true" />
                            <span className="truncate">{lecturer.email}</span>
                        </div>
                    )}
                </>
            }
        >
            {/* Rating */}
            {lecturer.averageRating && lecturer.ratingsCount > 0 ? (
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-card p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">דירוג</span>
                        <span className="text-lg font-bold text-yellow-600">
                            {lecturer.averageRating.toFixed(1)}/5.0
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <TrackedCardStars rating={lecturer.averageRating} />
                        <span className="text-xs text-slate-600">
                            {lecturer.ratingsCount} ביקורות
                        </span>
                    </div>
                </div>
            ) : (
                <div className="bg-surface-sunken rounded-card p-4 mb-4 text-center">
                    <span className="text-sm text-muted">עדיין אין ביקורות</span>
                </div>
            )}
        </TrackedEntityCard>
    );
};

export default TrackedLecturerCard;
